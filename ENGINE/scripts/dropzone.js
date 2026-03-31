
const dropZone = document.getElementById('drop-zone');
const fileList = document.getElementById('file-list');

// 1. Show drop zone when dragging over the window
window.addEventListener('dragenter', async (e) => {
    e.preventDefault();
    if (await SITE.isMySite()) {
        dropZone.classList.add('active');

    }
});

// 2. Keep drop zone active while dragging
window.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// 3. Hide drop zone if user leaves the window or cancels
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

// 4. Handle the dropped files
window.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');

    const files = e.dataTransfer.files;
    handleFiles(files);
});

async function handleFiles(files) {
    for (const file of files) {
        // const li = document.createElement('li');
        // li.textContent = `Uploaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        // fileList.appendChild(li);

        // console.log("File detected:", file);


        // upload files

        // let file = files[0]
        // var input = document.querySelector('input[type="file"]')
        let targetPath = window.location.pathname;
        let filepath = targetPath + '/' + file.name
        filepath = filepath.replaceAll('//', '/')
        let username = window.AUTH.getUsername()

        // var data = new FormData()
        // data.append('file', file)
        // data.append('filepath', filepath)
        // data.append('username', username)


        // let res = await fetch('https://api.micahpowch.com/upload', {
        //     method: 'POST',
        //     body: data,
        // })

        let res = await API.uploadFile(file, filepath, username)

        let text = await res.text();
        console.log('text', text)

        pagetrix.clearCache()

        if (text == 'reload') {
            pagetrix.reload();
        }

        // clear pagetrix cache
    }
}