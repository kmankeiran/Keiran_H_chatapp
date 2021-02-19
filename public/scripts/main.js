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
            isSomeoneElseTyping: false
        },

        created: function() {
            console.log('its alive!!!');
        },

        methods: {
            dispatchMessage() {
                //debugger;
                socket.emit('chatmessage', { content: this.message, name: localStorage.getItem('name') || "Anonymous" });
                socket.emit('istyping', { istyping: false, name: localStorage.getItem('name') || "Anonymous" });
                this.isTyping = false;

                this.message = "";
            },
            onKeyPress() {
                // If the sentence is greater than 0 and the user is inputing something, let Vue know they are typing
                if(this.message.length > 0 && !this.isTyping) {
                    this.isTyping = true;
                    socket.emit('istyping', { istyping: true, name: localStorage.getItem('name') || "Anonymous" });
                } 
                // If Vue thinks they are typing but the message is the length of 0, then tell Vue they are no longer typing. Like backspacing.
                else if(this.isTyping && this.message.length==0){
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