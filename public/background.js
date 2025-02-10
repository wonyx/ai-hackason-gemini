chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getHtml
  });
});
function getHtml() {
  const html = document.documentElement.outerHTML;
  console.log(html); // You can also send this to the background script or store it as needed
}