const filter = document.querySelector("select.filter");
const filterButton = document.querySelector("button.filterButton");

filterButton.addEventListener("click", async() => {
    console.log("filter=" + filter.value.replaceAll(" ", "+"));
    const response = await fetch("/", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: "filter=" + filter.value.replaceAll(" ", "+"),
    });

    if(response.ok)
        window.location = "/" + response.body;
    else
        console.log("Error Filtering Entries");
});