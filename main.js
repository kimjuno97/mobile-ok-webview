// 페이지 로드
window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const script = document.createElement("script");

  // 스크립트 소스 설정
  script.src =
    type === "dev"
      ? "https://scert.mobile-ok.com/resources/js/index.js"
      : "https://cert.mobile-ok.com/resources/js/index.js";

  // 스크립트 로드 완료 후 실행
  script.onload = () => {
    sendEventToFlutter("inProgress");
    onReceiveToken(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJJTExZSUxMWSIsIklEIjoxNjIsImV4cCI6MTc0NTQ4MDU3MX0.aGGz_GWUBoWA9wUgApVLRNx2hUdWKJJ5pTrrHIZM8uQWC5AKiIvHNKT4i8LUUnKf_JTuQLxuRPj9US1COcrjZfiLF2lF4zVaVt7m3Fi510jIVtE7nYVwVVmcRSygfww0FRODbUPFxUV8r1YTN8v2VnK-v8rQbdRBwAQ_b4HQu-FMvZqCDPR6ofzkUBGFr9lzZSMRwewzBw9LKvU2xX-cJA8rLVf9EAVttrdKdx2GfC5PNNPjc5AAHJ6GlWHjbQQHtvvs4iKnDLz7Cf3Z0U5mcW4MNmNQvf0Etcs47HBpsIv0ww5bjHmK7u4-wppr9tW4jjzcBkt6P2SVDMb9eDk_Wg"
    );
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
      EventChannel.postMessage(response);
      EventChannel.postMessage("success");
    }
  } catch (error) {
    console.log("error", error);
    EventChannel.postMessage(`error ${error}`);
    window.alert("인증에 실패하였습니다.");
  }
}

function onReceiveToken(token) {
  accessToken = token;
  MOBILEOK.process("https://api.illyilly.kr/pass/initial-data", "MB", "result");
}

// JS에서 Flutter로 이벤트 전송 함수
function sendEventToFlutter(event) {
  // Flutter WebView 환경에서만 동작
  if (window.EventChannel) {
    EventChannel.postMessage(event);
  }
}
