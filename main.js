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
  // type 파라미터 읽기
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type"); // "dev" 또는 "prod"

  // 조건에 따라 script 태그 동적 추가
  if (type === "dev") {
    const script = document.createElement("script");
    script.src = "https://scert.mobile-ok.com/resources/js/index.js";
    document.head.appendChild(script);
  } else {
    const script = document.createElement("script");
    script.src = "https://cert.mobile-ok.com/resources/js/index.js";
    document.head.appendChild(script);
  }

  MOBILEOK.process("https://api.illyilly.kr/pass/initial-data", "MB", "result");
};
