const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

const typing = document.getElementById("typing");
const autoReply = document.getElementById("autoReply");
const agentToggle = document.getElementById("agentToggle");
const totalReplies = document.getElementById("totalReplies");
const searchContact = document.getElementById("searchContact");
const contacts = document.querySelectorAll(".contact");
const quickReplyButtons = document.querySelectorAll(".quick-replies button");

let agentActive = true;
let replyCount = 24;

/* SEND MESSAGE */
sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

function sendMessage(){
    const text = messageInput.value.trim();

    if(text === ""){
        return;
    }

    addMessage(text, "sent");
    messageInput.value = "";

    if(agentActive && autoReply.checked){
        setTimeout(() => {
            generateAIReply(text);
        }, 900);
    }
}

/* ADD MESSAGE */
function addMessage(text, type){
    const message = document.createElement("div");
    message.classList.add("message", type);
    const time = getCurrentTime();

    message.innerHTML = `
        ${escapeHTML(text)}
        <span>
            ${time}
            ${type === "sent" ? " ✓✓" : ""}
        </span>
    `;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

/* GET TIME */
function getCurrentTime(){
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if(minutes < 10){
        minutes = "0" + minutes;
    }

    return `${hours}:${minutes}`;
}

/* SIMPLE AI AGENT */
function generateAIReply(userMessage){
    typing.style.display = "block";
    const text = userMessage.toLowerCase();
    let reply;

    if(
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("salam")
    ){
        reply = "Wa Alaikum Assalam! 😊 Aap ki kya help kar sakta hoon?";
    }
    else if(
        text.includes("website") ||
        text.includes("web")
    ){
        reply = "Ji bilkul! Hum modern aur responsive websites banate hain. Aap kis type ki website banana chahte hain?";
    }
    else if(
        text.includes("price") ||
        text.includes("price kya") ||
        text.includes("kitne") ||
        text.includes("cost")
    ){
        reply = "Website ki price requirements par depend karti hai. Aap pages aur features bata dein, phir estimate diya ja sakta hai.";
    }
    else if(text.includes("portfolio")){
        reply = "Ji, portfolio website bhi ban sakti hai jisme About, Skills, Projects aur Contact sections honge.";
    }
    else if(
        text.includes("contact") ||
        text.includes("number")
    ){
        reply = "Apna naam aur project requirements bhej dein. Main details collect kar leta hoon.";
    }
    else if(
        text.includes("thanks") ||
        text.includes("thank")
    ){
        reply = "You're welcome 😊 Agar aur koi sawal ho to bata dein.";
    }
    else if(text.includes("bye")){
        reply = "Allah Hafiz! 😊 Aapse baat karke acha laga.";
    }
    else{
        reply = "Thanks for your message 😊 Main aapki request samajh raha hoon. Thori aur details share kar dein.";
    }

    setTimeout(() => {
        typing.style.display = "none";
        addMessage(reply, "received");
        replyCount++;
        totalReplies.textContent = replyCount;
    }, 1200);
}

/* AGENT ON / OFF */
agentToggle.addEventListener("click", function(){
    agentActive = !agentActive;

    if(agentActive){
        agentToggle.textContent = "AI ON";
        agentToggle.classList.add("active");
    }else{
        agentToggle.textContent = "AI OFF";
        agentToggle.classList.remove("active");
    }
});

/* CONTACT SWITCH */
contacts.forEach(contact => {
    contact.addEventListener("click", function(){
        contacts.forEach(item => {
            item.classList.remove("active");
        });

        contact.classList.add("active");

        const name = contact.getAttribute("data-name");

        document.getElementById("chatName").textContent = name;
        document.getElementById("headerAvatar").textContent = name.charAt(0);

        messages.innerHTML = "";

        addMessage(
            `Assalamualaikum, main ${name} hoon.`,
            "received"
        );
    });
});

/* SEARCH CONTACT */
searchContact.addEventListener("input", function(){
    const search = searchContact.value.toLowerCase();

    contacts.forEach(contact => {
        const name = contact
            .getAttribute("data-name")
            .toLowerCase();

        if(name.includes(search)){
            contact.style.display = "flex";
        }else{
            contact.style.display = "none";
        }
    });
});

/* QUICK REPLIES */
quickReplyButtons.forEach(button => {
    button.addEventListener("click", function(){
        const text = this.getAttribute("data-message");
        messageInput.value = text;
        messageInput.focus();
    });
});

/* BASIC HTML PROTECTION */
function escapeHTML(text){
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
