const messages = [
    "Em chắc chứ?",
    "Em lỡ làm vậy với anh saoo??",
    "Em hết iu anh rùi hả?",
    "Đừng mà...",
    "Linh dangiu cuti oi!",
    "Nếu em từ chối, anh sẽ khóc nhiều hơn nước sông Hồng nữa..",
    "Anh sẽ rất buồn...",
    "Anh sẽ buồn nhiều nhiều nhiều đấy ...",
    "Thôi được rồi, anh không cản em nữa...",
    "Nhưng,.. anh vẫn muốn em nói có! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}
