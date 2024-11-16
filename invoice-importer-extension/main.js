document.getElementById("importButton").addEventListener("click", function() {
    let fileUploadField = document.getElementById("fileUploadField");
    const file = fileUploadField.files[0];

    if (file) {
        let reader = new FileReader();
        reader.readAsText(file);
        
        reader.onload = function() {
            // Get the contents of the uploaded file
            const fileContents = reader.result;

            // Get the active tab ID
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs.length > 0) {
                    const tabId = tabs[0].id;

                    // Inject a dynamically created script with the file contents
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        func: (htmlContent) => {
                            // Create a new script element and append the file content
                            const script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.text = htmlContent;
                            document.body.appendChild(script);
                        },
                        args: [fileContents],
                        world: "MAIN"
                    })
                    .then(() => console.log("Script injected with file contents"))
                    .catch(err => console.error("Error injecting script:", err));
                } else {
                    console.error("No active tab found.");
                }
            });
        };

        reader.onerror = function() {
            console.log(reader.error);
        };
    }
});
