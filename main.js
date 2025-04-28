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

    await fetch(url, requestOptions);
  } catch (error) {
    window.alert("인증에 실패하였습니다.");
  } finally {
    window.close();
  }
}

function onReceiveToken(token) {
  accessToken = token;
  MOBILEOK.process(
    "https://api.illyilly.kr/pass/initial-data/mobile",
    "MWV",
    "result"
  );
  // MOBILEOK.process("https://api.illyilly.kr/pass/initial-data", "HY", "result");
}
