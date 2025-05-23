const images = Array.from({ length: 100 }, (_, i) => `images/img${i + 1}.jpg`);

let currentIndex = 0;
const galleryImage = document.getElementById('galleryImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbnailsDiv = document.getElementById('thumbnails');
const editBtn = document.getElementById('editBtn');
const detailsBtn = document.getElementById('detailsBtn');
const zoomBtn = document.getElementById('zoomBtn');
const shareBtn = document.getElementById('shareBtn');
const insertBtn = document.getElementById('insertBtn');
const deleteBtn = document.getElementById('deleteBtn');
const detailsContent = document.getElementById('detailsContent');
const brightnessInput = document.getElementById('brightness');
const contrastInput = document.getElementById('contrast');
const applyEditBtn = document.getElementById('applyEdit');
const zoomLevelInput = document.getElementById('zoomLevel');
const zoomImage = document.getElementById('zoomImage');
const applyZoomBtn = document.getElementById('applyZoom');
const shareLinkInput = document.getElementById('shareLink');
const shareEmailInput = document.getElementById('shareEmail');
const shareMessageInput = document.getElementById('shareMessage');
const sendShareBtn = document.getElementById('sendShare');
const photoUploadInput = document.getElementById('photoUpload');
const uploadPhotoBtn = document.getElementById('uploadPhoto');

function showImage(index) {
    galleryImage.src = images[index];
    document.querySelectorAll('.thumbnails img').forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

function createThumbnails() {
    thumbnailsDiv.innerHTML = '';
    images.forEach((src, i) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.alt = `Thumbnail ${i+1}`;
        thumb.addEventListener('click', () => {
            currentIndex = i;
            showImage(currentIndex);
        });
        if (i === currentIndex) thumb.classList.add('active');
        thumbnailsDiv.appendChild(thumb);
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
});

editBtn.addEventListener('click', () => {
    $('#editModal').modal('show');
});

applyEditBtn.addEventListener('click', () => {
    const brightness = brightnessInput.value;
    const contrast = contrastInput.value;
    galleryImage.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    $('#editModal').modal('hide');
});

detailsBtn.addEventListener('click', () => {
    const img = galleryImage;
    const details = `Filename: ${img.src.split('/').pop()}\nDimensions: ${img.naturalWidth}x${img.naturalHeight}\nFile Size: ${(img.naturalWidth * img.naturalHeight * 4 / 1024).toFixed(2)} KB`;
    detailsContent.innerHTML = `<pre>${details}</pre>`;
    $('#detailsModal').modal('show');
});

zoomBtn.addEventListener('click', () => {
    zoomImage.src = galleryImage.src;
    $('#zoomModal').modal('show');
});

applyZoomBtn.addEventListener('click', () => {
    const zoomLevel = zoomLevelInput.value;
    galleryImage.style.transform = `scale(${zoomLevel / 100})`;
    $('#zoomModal').modal('hide');
});

shareBtn.addEventListener('click', () => {
    shareLinkInput.value = galleryImage.src;
    $('#shareModal').modal('show');
});

sendShareBtn.addEventListener('click', () => {
    const email = shareEmailInput.value;
    const message = shareMessageInput.value;
    if (email) {
        alert(`Image shared with ${email}. Message: ${message}`);
        $('#shareModal').modal('hide');
    } else {
        alert('Please enter an email address.');
    }
});

insertBtn.addEventListener('click', () => {
    $('#insertModal').modal('show');
});

uploadPhotoBtn.addEventListener('click', () => {
    const file = photoUploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            images.push(e.target.result);
            createThumbnails();
            currentIndex = images.length - 1;
            showImage(currentIndex);
            $('#insertModal').modal('hide');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image to upload.');
    }
});

deleteBtn.addEventListener('click', () => {
    if (images.length > 1) {
        images.splice(currentIndex, 1);
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        createThumbnails();
        showImage(currentIndex);
    } else {
        alert('Cannot delete the last image.');
    }
});

// Initialize
createThumbnails();
showImage(currentIndex);