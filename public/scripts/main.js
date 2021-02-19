import ChatMessage from "./components/TheMessageComponent.js"

(() => {
    console.log('fired');

    // Get the username that was inputted and save it in a variable
    const name = localStorage.getItem('name');

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

    function setIsSomeoneTyping(msg) {
       // Check if the message is coming from someone else by making sure the socket ID doesn't match ours
        if(vm.socketID != msg.id) {
            //Set the isSomeoneElseTyping to what the message has
            vm.isSomeoneElseTyping = msg.message.istyping;
        }
    }

    const vm = new Vue({
        data: {
            messages: [],
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
                socket.emit('chatmessage', { content: this.message, name: name || "Anonymous" });
                socket.emit('istyping', { istyping: false, name: name || "Anonymous" });
                this.isTyping = false;

                this.message = "";
            },
            onKeyPress() {
                // If the sentence is greater than 0 and the user is inputing something, let Vue know they are typing
                if(this.message.length > 0 && !this.isTyping) {
                    this.isTyping = true;
                    socket.emit('istyping', { istyping: true, name: name || "Anonymous" });
                } 
                // If Vue thinks they are typing but the message is the length of 0, then tell Vue they are no longer typing. Like backspacing.
                else if(this.isTyping && this.message.length==0){
                    this.isTyping = false;
                    socket.emit('istyping', { istyping: false, name: name || "Anonymous" });
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