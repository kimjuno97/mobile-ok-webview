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
    try {
      // 스크립트 로드 완료 시 Flutter에 알림
      window.successLoad.postMessage("successLoad");
    } catch (error) {
      const oldErrorP = document.getElementById("error-message");
      if (oldErrorP) oldErrorP.remove();

      // 새 p 태그 생성 및 추가
      const errorP = document.createElement("p");
      errorP.textContent = error.message;
      errorP.style.color = "red";
      errorP.id = "error-message";

      document.body.appendChild(errorP);
    }

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
    // 결제 성공 시 Flutter에 결과 전송
    window.mobileOkResult.postMessage("success");
  } catch (error) {
    // 기존 에러 메시지 p 태그가 있으면 제거
    const oldErrorP = document.getElementById("error-message");
    if (oldErrorP) oldErrorP.remove();

    // 새 p 태그 생성 및 추가
    const errorP = document.createElement("p");
    errorP.textContent = error.message;
    errorP.style.color = "red";
    errorP.id = "error-message";

    document.body.appendChild(errorP);

    // 에러 발생 시 Flutter에 전송
    window.mobileOkError.postMessage(`${error.message}`);
  } finally {
  }
}

function onReceiveToken(token) {
  // 새 p 태그 생성 및 추가
  const loading = document.createElement("p");
  loading.textContent = "processLoading...";
  loading.id = "loading-message";
  document.body.appendChild(loading);
  accessToken = token;
  // MOBILEOK.process(
  //   "https://api.illyilly.kr/pass/initial-data",
  //   "NA",
  //   "result"
  // );
  MOBILEOK.process("https://api.illyilly.kr/pass/initial-data", "HY", "result");
}
