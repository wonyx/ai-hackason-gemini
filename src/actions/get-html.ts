export async function getHtmlByTabId({ tabId }: { tabId: number }) {
    const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        // @ts-ignore
        function: () => document.documentElement.outerHTML,
    });
    // console.log('results', results);
    return results[0].result;
}