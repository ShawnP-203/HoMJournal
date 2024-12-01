const changeButton = document.querySelector("input.submit");
const deleteButton = document.querySelector("input.delete");

function common()
{
    changeButton.disabled = true;
    deleteButton.disabled = true;
    document.body.appendChild(document.createElement("style"));
    document.querySelector("style").innerHTML = ".buttons::after {content: none;}";
}

changeButton.addEventListener("click", async() => {
    common();
    deleteButton.setAttribute("style", "display:none;");
    changeButton.value = "Modifying...";

    // Get values from the entry form
    const desc = document.getElementById("content").value.trim();
    if(desc === "")
    {
        changeButton.value = "Description missing.";
        await new Promise(r => setTimeout(r, 3000));
        changeButton.disabled = false;
        deleteButton.disabled = false;
        deleteButton.removeAttribute("style");
        document.body.removeChild(document.querySelector("style"));
        changeButton.value = "Create Entry";
        return;
    }
    
    const entry = {content: desc, delete: false};

    // Send a POST request to the router and wait for a response
    const response = await fetch(window.location, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        changeButton.value = "Modification successful.";
        await new Promise(r => setTimeout(r, 1000));
        window.location = "/";
    } else {
        console.log("Error Changing Entry");
    }
});

deleteButton.addEventListener("click", async() => {
    common();
    changeButton.setAttribute("style", "display:none;");
    deleteButton.value = "Deleting...";

    // Get values from the entry form
    const desc = document.getElementById("content").value;
    const entry = {content: desc, delete: true};

    // Send a POST request to the router and wait for a response
    const response = await fetch(window.location, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        deleteButton.value = "Deletion successful.";
        await new Promise(r => setTimeout(r, 1000));
        window.location = "/";
    } else {
        console.log("Error Deleting Entry");
    }
});