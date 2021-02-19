import ChatMessage from "./components/TheMessageComponent.js"

(() => {
    console.log('fired');

    // load the socket library and make a connection
    const socket = io();

    // messenger service event handling -> incoming from the manager
    function setUserId({sID, message}) {
        // incoming connected event with data
        // debugger;
        vm.socketID = sID;
    }

    function appendMessage(message) {
        //debugger;
        vm.messages.push(message);
    }

    function setIsSomeoneTyping(message) {
        console.log("someone else is typing");
        vm.isSomeoneElseTyping = message.istyping && message.name != localStorage.getItem('name');
    }

    const vm = new Vue({
        data: {
            messages: [],
            nickname: "",
            username: "",
            socketID: "",
            message: "",
            isTyping: false,
            isSomeoneElseTyping: false,
        },

        created: function() {
            console.log('its alive!!!');
        },

        methods: {
            dispatchMessage() {
                //debugger;
                socket.emit('chatmessage', { content: this.message, name: localStorage.getItem('name') || "Anonymous" });

                this.message = "";
            },
            onKeyPress() {
                if(this.message.length > 0 && !this.isTyping) {
                    this.isTyping = true;
                    socket.emit('istyping', { istyping: true, name: localStorage.getItem('name') || "Anonymous" });
                } else if(this.isTyping && this.message.length==0){
                    this.isTyping = false;
                    socket.emit('istyping', { istyping: false, name: localStorage.getItem('name') || "Anonymous" });
                }
            }
        },

        components: {
            newmessage: ChatMessage
        }
    }).$mount("#app");

    socket.addEventListener("connected", setUserId);
    socket.addEventListener('message', appendMessage);
    socket.addEventListener('istyping', setIsSomeoneTyping);
})();