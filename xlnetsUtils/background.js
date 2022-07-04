function xlnetsUtils(){	
	let xlnetsLoginJSP = 'N38LoginEuskadi.jsp';
	let xlnetsLoginInfoJSP = 'N38LoginInf.jsp';
	let url = document.location.href;
	if(url.indexOf(xlnetsLoginJSP) > -1){		
		document.cookie = "gogoratuAukeraadfs-1=ukatu; path=/; domain=xlnets.servicios.des.ejgv.euskalsarea.eus";	
	}else if(url.indexOf(xlnetsLoginInfoJSP) > -1){		
		document.getElementById('botizq').click();
	}
}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {		
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: xlnetsUtils
	});
});

	