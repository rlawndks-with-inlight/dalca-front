export const onPostWebview = (method, data) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ method: method, data: data }))
    }
}