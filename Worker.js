export default {
  /**
   * Cloudflare Worker 的主要请求处理函数。
   * @param {Request} request 传入的请求对象
   * @param {Object} env 环境配置对象
   * @param {Object} ctx 上下文对象
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ 静态内容源地址 (现在指向您的 R2 存储桶)
    // 如果用户访问 worker.domain/path/to/file，实际会去请求 R2_CONTENT_URL/path/to/file
    const CONTENT_SOURCE_URL = "https://pub-3b1b42ae8adb483cb2455c8ee77143d5.r2.dev/pl.m3u";

    // 🚫 非 OTT 播放器访问者要重定向去的地址
    const REDIRECT_URL = "https://life4u22.blogspot.com/p/ott-channel-review.html";

    // 读取 User-Agent
    const ua = request.headers.get("User-Agent") || "";

    // ✅ 判断是否是 OTT Player（根据 UA 关键字匹配）
    // 您可以根据需要添加或修改关键字
    const ottKeywords = ["OTT Player", "OTT TV", "OTT Navigator"];
    const isOTT = ottKeywords.some(keyword => ua.includes(keyword));

    if (isOTT) {
      // 如果是 OTT Player，则转发请求到 R2 内容源
      const target = `${CONTENT_SOURCE_URL}${url.pathname}${url.search}`;
      
      // ⚠️ 注意：为了确保 `fetch` 能正确处理跨域请求并转发所有请求头，
      // 最好在 fetch 选项中传递原始请求的 headers 和 method。
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
