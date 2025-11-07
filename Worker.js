export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ 你的 GitHub Pages 地址（静态内容源）
    const GITHUB_PAGES_URL = "https://powertech0417.github.io/op/";

    // 🚫 其它访问者要重定向去的地址
    const REDIRECT_URL = "https://life4u22.blogspot.com/p/ott-channel-review.html";

    // 读取 User-Agent
    const ua = request.headers.get("User-Agent") || "";

    // ✅ 判断是否是 OTT Player（根据 UA 关键字匹配）
    // 你可以替换为你的播放器标识，例如 "OTTPlayer", "OTT TV", "OTT Navigator" 等
    const ottKeywords = ["OTTPlayer", "OTT TV", "OTT Navigator"];
    const isOTT = ottKeywords.some(keyword => ua.includes(keyword));

    if (isOTT) {
      // 允许访问，转发到 GitHub Pages
      const target = `${GITHUB_PAGES_URL}${url.pathname}${url.search}`;
      const response = await fetch(target, {
        method: request.method,
        headers: request.headers,
      });
      return response;
    } else {
      // 非 OTT Player → 302 跳转到指定网站
      return Response.redirect(REDIRECT_URL, 302);
    }
  },
};
