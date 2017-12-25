/*
動画の情報を取得してbackgroundへ投げる
取得する情報：
  ・ダウンロード対象のURL
  ・タイトル
  ・アップロードしたユーザーの名前
*/
function getInfo(){
  var button = document.getElementById("download-button");
  button.click();
  var links = document.getElementById("download-options").getElementsByTagName('a');
  var info = document.getElementsByClassName('node-info')[0];
  var title = info.getElementsByTagName('h1');
  var username = info.getElementsByTagName('img');
  var html_lang = document.getElementsByTagName('html')[0].lang;
  if(html_lang === 'ja') {
    username = username[0].title.replace("ユーザー ","").replace(" の写真","");
  } else if(html_lang === 'en') {
    username = username[0].title.replace(/(&#39;)/, "'").replace("'s picture","");
  } else if(html_lang === 'zh-hans') {
    username = username[0].title.replace("的头像", "");
  } else {
    username = username[0].title.replace("Bild des Benutzers ", "");
  }
  var posted_date = info.textContent.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
  if(posted_date !== null){
    posted_date = posted_date[0].replace(/-/g, "").replace(/:/g, "").replace(" ","");
  }

  var link_url = "";
  if(typeof links[2] !== "undefined"){
    link_url = links[2].href;
  } else if(typeof links[1] !== "undefined") {
    link_url = links[1].href;
  } else {
    link_url = links[0].href;
  }
  chrome.runtime.sendMessage({
    source_url: link_url,
    title: convertSafeFileName(title[0].innerHTML),
    username: convertSafeFileName(username),
    posted_date: posted_date
  });
}

/*
backgroundからのメッセージを受信したらgetInfoを実行
*/
chrome.runtime.onMessage.addListener(getInfo);

/*
使用できない文字を全角に置き換え
¥　/　:　*　?　"　<　>　|
chromeのみ
半角チルダを全角チルダへ変換
半角ピリオドを全角ピリオドへ変換
*/
function convertSafeFileName(titleOrUsername){
  return unEscapeHTML(titleOrUsername)
    .replace(/\\/g,'￥')
    .replace(/\//g,'／')
    .replace(/:/g,'：')
    .replace(/\*/g,'＊')
    .replace(/\?/g,'？')
    .replace(/"/g,'”')
    .replace(/</g,'＜')
    .replace(/>/g,'＞')
    .replace(/\|/g,'｜').replace(/~/g,'～').replace(/\./g,'．');
}

/**
 * HTMLアンエスケープ
 *
 * @param {String} str 変換したい文字列
 */
var unEscapeHTML = function (str) {
  return str
    .replace(/(&lt;)/g, '<')
    .replace(/(&gt;)/g, '>')
    .replace(/(&quot;)/g, '"')
    .replace(/(&#39;)/g, "'")
    .replace(/(&amp;)/g, '&');
};
