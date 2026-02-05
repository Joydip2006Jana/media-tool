function sendUrl() {
    const urlInput = document.getElementById("videoUrl");
    const btn = document.querySelector("button");
    const result = document.getElementById("result");
    const info = document.getElementById("info");
    const thumb = document.getElementById("thumbnail");
    const loader = document.getElementById("loader");

    const url = urlInput.value.trim();

    result.innerText = "";
    info.innerHTML = "";
    thumb.style.display = "none";

    if (!url) {
        result.innerText = "URL দাও ❌";
        result.style.color = "red";
        return;
    }

    // UI lock
    btn.disabled = true;
    btn.innerText = "Processing...";
    loader.style.display = "block";

    fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url })
    })
    .then(res => res.json())
    .then(data => {
        result.innerText = data.message;
        result.style.color = "green";

        if (data.title) {
            info.innerHTML = `
                <div><b>Title:</b> ${data.title}</div>
                <div><b>Channel:</b> ${data.channel}</div>
            `;
        }

        if (data.thumbnail) {
            thumb.src = data.thumbnail;
            thumb.style.display = "block";
        }
    })
    .catch(() => {
        result.innerText = "Something went wrong ❌";
        result.style.color = "red";
    })
    .finally(() => {
        // UI unlock
        loader.style.display = "none";
        btn.disabled = false;
        btn.innerText = "Submit";
    });
}
