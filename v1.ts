enum DetectionMethod {
  "ip-only" = "ip-only",
  "timezone-then-ip" = "timezone-then-ip",
}

const redirectRussia = async () => {
  // How it works:
  // (1) We detect your timezone to estimate if you're in Russia
  // (2) If we think you may be, we make an IP address geolocation API request to confirm
  // (3) If you are in indeed in Russia, we redirect you to a pro-Ukraine website

  const currentScript = document.currentScript;
  if (!currentScript) return;

  // Find the redirection URL
  const REDIRECT_URL =
    currentScript.getAttribute("data-redirect-url") ??
    `https://redirectrussia.org/${
      currentScript.getAttribute("data-hide-domain") === "hide"
        ? ""
        : `?from=${document.domain}`
    }`;

  const redirect = () => {
    try {
      // Dispatch a custom event
      // To listen to this event, you can add the following JavaScript:
      // document.addEventListener("redirect-russia", (event) => { /* */ }, false);
      const event = new Event("redirect-russia");
      document.dispatchEvent(event);

      // Set in session storage so we don't have to compute again
      window.sessionStorage.setItem("russia-redirect", "1");
    } catch (error) {
      // Ignore errors in storage or events
    }
    window.location.assign(REDIRECT_URL);
  };

  try {
    const shouldRedirect = window.sessionStorage.getItem("russia-redirect");
    if (shouldRedirect === "1") return redirect();
  } catch (error) {
    // Ignore storage access errors
  }

  // Find the preferred method of location detection
  const detectionMethod =
    currentScript.getAttribute("data-detection") ??
    DetectionMethod["timezone-then-ip"];

  // If we find an unsupported method, throw an error
  if (
    detectionMethod !== DetectionMethod["ip-only"] &&
    detectionMethod !== DetectionMethod["timezone-then-ip"]
  )
    throw new Error("Redirect Russia: Unsupported location detection method");

  // By default, we assume that you're in Russia
  let mayBeRussian = true;

  // If the timezone-then-ip detection method is set
  if (detectionMethod === DetectionMethod["timezone-then-ip"]) {
    // Find the current timezone
    let currentTimezone: string | undefined = undefined;
    try {
      currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      // Ignore errors if `Intl` is unavailable or we're unable to find the timezone
    }

    const RUSSIAN_TIMEZONES = [
      "Asia/Anadyr",
      "Asia/Barnaul",
      "Asia/Chita",
      "Asia/Irkutsk",
      "Asia/Kamchatka",
      "Asia/Khandyga",
      "Asia/Krasnoyarsk",
      "Asia/Magadan",
      "Asia/Novokuznetsk",
      "Asia/Novosibirsk",
      "Asia/Omsk",
      "Asia/Sakhalin",
      "Asia/Srednekolymsk",
      "Asia/Tomsk",
      "Asia/Ust",
      "Asia/Vladivostok",
      "Asia/Yakutsk",
      "Asia/Yekaterinburg",
      "Europe/Astrakhan",
      "Europe/Kaliningrad",
      "Europe/Kirov",
      "Europe/Moscow",
      "Europe/Samara",
      "Europe/Saratov",
      "Europe/Simferopol", // This timezone is also in Ukraine
      "Europe/Ulyanovsk",
      "Europe/Volgograd",
    ];

    if (
      // If we're unable to find the timezone, you may be in Russia
      currentTimezone &&
      // If you're in a Russian timezone, you may be in Russia
      !RUSSIAN_TIMEZONES.includes(currentTimezone)
    )
      mayBeRussian = false;
  }

  if (!mayBeRussian) return;

  const geolocationEndpoint =
    currentScript.getAttribute("data-geolocation-api") ??
    "https://api.country.is";

  let countryCode: string | undefined = undefined; // Uppercase country code, e.g., "UA" or "DE"
  // Make IP geolocation request
  try {
    const response = await fetch(geolocationEndpoint);
    if (!response.ok) throw new Error("Response not OK");
    const json = (await response.json()) as {
      country: string;
      ip: string;
    };
    countryCode = json.country.toLowerCase();
  } catch (error) {
    // Ignore errors if we're unable to fetch
  }

  if (countryCode === "RU") return redirect();

  try {
    // Set in session storage so we don't have to compute again
    window.sessionStorage.setItem("russia-redirect", "0");
  } catch (error) {
    // Ignore storage access errors
  }
};

redirectRussia();
