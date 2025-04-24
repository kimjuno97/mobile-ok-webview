// 페이지 로드
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const token = params.get("token");
  const script = document.createElement("script");

  // 스크립트 소스 설정
  script.src =
    type === "dev"
      ? "https://scert.mobile-ok.com/resources/js/index.js"
      : "https://cert.mobile-ok.com/resources/js/index.js";

  // 스크립트 로드 완료 후 실행
  script.onload = () => {
    sendEventToFlutter("inProgress");

    setTimeout(() => {
      onReceiveToken(token);
    }, 1000);
  };

  document.head.appendChild(script);
};

let accessToken;

async function result(result) {
  try {
    const url = "https://api.illyilly.kr/v1/users/auth/pass";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ encodeToken: result }),
    };

    const response = await fetch(url, requestOptions);
    console.log("response", response);
    if (window.EventChannel) {
      // EventChannel.postMessage("success");
    }
  } catch (error) {
    console.log("error", error);
    // EventChannel.postMessage(`error ${error}`);
    window.alert("인증에 실패하였습니다.");
  }
}

function onReceiveToken(token) {
  accessToken = token;
  MOBILEOK.process(
    "https://api.illyilly.kr/pass/initial-data/mobile",
    "MB",
    ""
  );
}

// JS에서 Flutter로 이벤트 전송 함수
function sendEventToFlutter(event) {
  // Flutter WebView 환경에서만 동작
  if (window.EventChannel) {
    EventChannel.postMessage(event);
  }
}
