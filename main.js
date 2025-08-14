const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const token = params.get("token");
const baseUrl = params.get("baseUrl") ?? "https://api.illyilly.kr";

// 페이지 로드
window.onload = function () {
  /// [MEMO] 개발 완료시 제거
  console.log("baseUrl", baseUrl);

  const script = document.createElement("script");
  // 스크립트 소스 설정
  script.src =
    type === "dev"
      ? "https://scert.mobile-ok.com/resources/js/index.js"
      : "https://cert.mobile-ok.com/resources/js/index.js";

  // 스크립트 로드 완료 후 실행
  script.onload = () => {
    setTimeout(() => {
      onReceiveToken({ token, baseUrl });
    }, 1000);
  };

  document.head.appendChild(script);
};

let accessToken;

async function result(result) {
  try {
    /// [MEMO] 개발 완료시 url 확인
    const url = `${baseUrl}/v1/auth/verify`;
    // const url = `${baseUrl}/v1/users/auth/pass`;
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
    // window.close();
  }
}

function onReceiveToken({ token, baseUrl }) {
  accessToken = token;
  MOBILEOK.process(`${baseUrl}/pass/initial-data`, "HY", "result");
}
