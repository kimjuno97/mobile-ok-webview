async function result(result) {
  try {
    // const resultParse = JSON.parse(result);
    console.log("resultParse :", result);
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
  } catch (error) {
    console.log("error", error);
    window.alert("인증에 실패하였습니다.");
  } finally {
    window.location.href = "/signup/verification";
  }
}
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
    setTimeout(() => {
      MOBILEOK.process(
        "https://api.illyilly.kr/pass/initial-data",
        "MB",
        "result"
      );
    }, 1000);
  };

  document.head.appendChild(script);
};
