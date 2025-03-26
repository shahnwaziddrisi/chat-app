// Utility Functions
function debounce(func, delay) {
    let timeoutId;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// User List Creation
function createUserList({ avatar, name, time, status }, index) {
    // Validate input parameters
    if (!avatar || !name || !time) {
        console.error('Missing user data parameters');
        return null;
    }

    const newuser = document.createElement("div");
    newuser.classList.add("user-list");
    if (index === 0) {
        newuser.classList.add("active");
    }

    newuser.innerHTML = `
    <div class="user-list-sub" data-index="${index}">
        <div class="avatar">
            <img
                src="${avatar}"
                alt="${name}"
                loading="lazy"
            />
        </div>
        <div class="profile-highlight">
            <div class="user-name">
                <p class="title">${name}</p>
                <p class="time">${time}</p>
            </div>
            <p class="highlights">
                ${status || 'No status available'}
            </p>
        </div>
    </div>`;

    // Add click event listener instead of inline onclick
    newuser.querySelector('.user-list-sub').addEventListener('click', (e) => {
        checkScreen(e.currentTarget, index);
    });

    return newuser;
}

// Set User List
function setList(arr) {
    const userListContainer = document.querySelector(".userList");
    userListContainer.innerHTML = ''; // Clear existing list

    arr.forEach((item, index) => {
        const userElement = createUserList(item, index);
        if (userElement) {
            userListContainer.appendChild(userElement);
        }
    });
}

// Screen Check and Responsiveness
function checkScreen(element, index) {
    // Remove active class from all user lists
    document.querySelectorAll('.user-list').forEach(el =>
        el.classList.remove('active'));

    // Add active to parent user-list
    element.closest('.user-list').classList.add('active');

    // Responsive layout for mobile
    if (window.innerWidth <= 750) {
        document.querySelector(".left").style.display = "none";
        document.querySelector(".right").style.display = "block";
        document.querySelector(".right").style.width = "100%";
    }

    currentUser(element, index);
}

// Current User Selection
function currentUser(element, index) {
    const name = element.querySelector('.title').textContent;
    const currentUserData = usersData.find(item => item.name === name);

    let selectedChat = null;
    const chatKey = `chat${index + 1}`;
    selectedChat = JsonData[chatKey];

    UpdateChat([currentUserData], selectedChat);
}

// Update Chat UI
function UpdateChat([{ avatar, name, status }], chat) {
    const chatBox = document.querySelector(".chat-box");
    chatBox.innerHTML = ''; // Clear previous content

    // Create current user header
    const current_user = document.createElement("div");
    current_user.classList.add("current-user");
    current_user.innerHTML = `
        <div class="current-user-sub">
            <div class="current_avatar">
                <span>
                    <img src="${avatar}" alt="${name}" />
                    <div class="online"></div>
                </span>
            </div>
            <div class="current_status">
                <p class="current-title">${name}</p>
                <p class="current-highlights">${status || 'No status'}</p>
            </div>
        </div>`;

    chatBox.appendChild(current_user);
    AddChat(chat);
}

// Add Chat Messages
function AddChat(chat) {
    const chatBox = document.querySelector(".chat-box");
    const chatData = document.createElement("div");
    chatData.classList.add("chat");

    if (chat && chat.length) {
        chat.forEach((element) => {
            const user_container = document.createElement("div");
            const user_mssg = document.createElement("p");

            user_mssg.textContent = element.msg.message;
            user_container.appendChild(user_mssg);

            user_container.classList.add(
                element.from.type === "user1"
                    ? "user1-container"
                    : "user2-container"
            );
            user_mssg.classList.add(
                element.from.type === "user1"
                    ? "user1-mssg"
                    : "user2-mssg"
            );

            chatData.appendChild(user_container);
        });
    }

    chatBox.appendChild(chatData);
}

// Go Back Function for Mobile
function goBack() {
    document.querySelector(".right").style.display = "none";
    document.querySelector(".left").style.display = "block";
    document.querySelector(".left").style.width = "100%";
}

// Responsive Resize Event
window.addEventListener("resize", () => {
    const left = document.querySelector(".left");
    const right = document.querySelector(".right");

    if (window.innerWidth <= 750) {
        left.style.display = "block";
        left.style.width = "100%";
        right.style.display = "none";
    } else {
        left.style.width = "32%";
        left.style.display = "block";
        right.style.width = "68%";
        right.style.display = "block";
    }
});

// Search User
function searchUser(event) {
    const input = event.target.value.toLowerCase();
    const userList = document.querySelector(".userList");

    userList.innerHTML = "";

    if (input === "") {
        setList(usersData);
        return;
    }

    const newList = usersData.filter(item =>
        item.name.toLowerCase().includes(input)
    );

    if (newList.length === 0) {
        userList.innerHTML = "<div style='font-weight: bold; text-align: center;'>No Data Found</div>";
    } else {
        setList(newList);
    }
}

// Debounced Search
const debouncedSearchUser = debounce(searchUser, 300);
document.querySelector('.searchUser').addEventListener('input', debouncedSearchUser);

// Theme Selection
function selectTheme(event) {
    const root = document.documentElement;
    const color = event.target.value;

    root.style.setProperty(
        "--my-mssg",
        color === "Change theme" ? "#00A0AE" : color
    );
}

// Background Change
function changeBg(event) {
    const root = document.documentElement;
    const backgrounds = {
        "Change background": 'url("https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg")',
        "image1": 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")',
        "image2": 'url("https://wallpaperaccess.com/full/1288076.jpg")',
        "image3": 'url("https://i.pinimg.com/736x/78/1e/21/781e212cb0a891c6d8a3738c525e235d.jpg")'
    };

    root.style.setProperty(
        "--background-img",
        backgrounds[event.target.value] || backgrounds["Change background"]
    );
}

// Character and Word Count
function calc(input) {
    const str = input.value;
    const charCount = str.length;
    const wordCount = str.trim() ? str.trim().split(/\s+/).length : 0;

    document.querySelector('.count-char').textContent =
        `Current characters:${charCount} and current words:${wordCount}`;
}

// Send Message
function sendMssg() {
    const inpMssg = document.querySelector(".inpMssg");

    if (!inpMssg.value.trim()) {
        alert("Please enter some text");
        return;
    }

    const activeUserIndex = Array.from(document.querySelectorAll(".user-list"))
        .findIndex(el => el.classList.contains("active"));

    const chatKey = `chat${activeUserIndex + 1}`;
    const newMessage = {
        from: { type: "user2" },
        msg: { message: inpMssg.value }
    };

    // Ensure JsonData is initialized
    JsonData[chatKey] = JsonData[chatKey] || [];
    JsonData[chatKey].push(newMessage);

    // Remove existing chat and re-render
    const chatElement = document.querySelector('.chat');
    if (chatElement) chatElement.remove();

    AddChat(JsonData[chatKey]);

    // Reset input
    inpMssg.value = "";
    calc(inpMssg);
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    // Initial user list setup
    setList(usersData);

    // Add event listeners
    document.querySelector('.inpMssg').addEventListener('input', () => calc(document.querySelector('.inpMssg')));
    document.querySelector('.send-btn').addEventListener('click', sendMssg);
});