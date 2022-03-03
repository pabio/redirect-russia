window.addEventListener("DOMContentLoaded", () => {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("from")) {
    document.querySelector(".hero").removeAttribute("hidden");
    document.querySelector("main").setAttribute("hidden", "hidden");
    document.querySelector("body").style.backgroundColor = "#fcff63";
    document.querySelector(".hero h2").innerHTML = document
      .querySelector(".hero h2")
      .innerHTML.replace("This site", searchParams.get("from"));
  }

  const redirectUrls = document.querySelectorAll('input[name="redirect-url"]');
  const apiUrls = document.querySelectorAll('input[name="geolocation"]');
  const domainShow = document.querySelectorAll('input[name="domain"]');
  const detectionMethods = document.querySelectorAll('input[name="detection"]');
  const otherRedirect = document.querySelector(".redirect-other");
  const otherApi = document.querySelector(".ip-api-other");
  const result = document.querySelector("#result");

  let redirectUrl = "default";
  let otherRedirectUrl = "";
  let detection = "timezone-then-ip";
  let apiUrl = "https://api.country.is";
  let otherApiUrl = "";
  let showDomain = "yes";

  const update = () => {
    if (redirectUrl === "other") otherRedirect.removeAttribute("hidden");
    else otherRedirect.setAttribute("hidden", "hidden");

    if (apiUrl === "other") otherApi.removeAttribute("hidden");
    else otherApi.setAttribute("hidden", "hidden");

    result.innerHTML = `&lt;script src="https://redirectrussia.org/v1.js"${
      redirectUrl === "other" && otherRedirectUrl
        ? ` data-redirect-url="${otherRedirectUrl}"`
        : ""
    }${detection === "ip-only" ? ` data-detection="ip-only"` : ""}${
      apiUrl === "other" && otherApiUrl
        ? ` data-geolocation-api="${otherApiUrl}"`
        : ""
    }${
      showDomain === "no" ? ` data-hide-domain="hide"` : ""
    } async&gt;&lt;/script&gt;`;
  };

  redirectUrls.forEach((input) =>
    input.addEventListener("change", (event) => {
      redirectUrl = (event.target as HTMLInputElement).value;
      update();
    })
  );

  apiUrls.forEach((input) =>
    input.addEventListener("change", (event) => {
      apiUrl = (event.target as HTMLInputElement).value;
      update();
    })
  );

  domainShow.forEach((input) =>
    input.addEventListener("change", (event) => {
      showDomain = (event.target as HTMLInputElement).value;
      update();
    })
  );

  detectionMethods.forEach((input) =>
    input.addEventListener("change", (event) => {
      detection = (event.target as HTMLInputElement).value;
      update();
    })
  );

  otherRedirect.querySelector("input").addEventListener("input", (event) => {
    otherRedirectUrl = (event.target as HTMLInputElement).value;
    update();
  });

  otherApi.querySelector("input").addEventListener("input", (event) => {
    otherApiUrl = (event.target as HTMLInputElement).value;
    update();
  });
});
