const submitButton = document.querySelector("input.submit");
submitButton.addEventListener("click", async() => {
    submitButton.disabled = true;
    submitButton.value = "Creating...";

    // Get values from the entry form
    const date = document.querySelector("input.date").value;

    if(date === "")
    {
        submitButton.value = "Date missing.";
        await new Promise(r => setTimeout(r, 3000));
        submitButton.disabled = false;
        submitButton.value = "Create Entry";
        return;
    }
    const habitOfMind = document.getElementById("hom").value;

    const content = document.getElementById("content").value.trim();
    if(content === "")
    {
        submitButton.value = "Description missing.";
        await new Promise(r => setTimeout(r, 3000));
        submitButton.disabled = false;
        submitButton.value = "Create Entry";
        return;
    }

    const entry = {date, habit: habitOfMind, content};

    // Send a POST request to the router and wait for a response
    const response = await fetch("/createEntry", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(entry),
    });

    // If the response is ok, go back to the home page
    if (response.ok) {
        submitButton.value = "Creation successful.";
        await new Promise(r => setTimeout(r, 1000));
        window.location = "/";
    } else {
        console.log("Error Creating Entry");
    }
});