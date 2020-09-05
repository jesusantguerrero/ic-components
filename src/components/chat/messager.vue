<template>
  <div class="chat-container h-screen">
    <chat-header
      :show-back-button="true"
      :show-settings="true"
      :title="channelName"
      :description="descriptionText"
      @back="leaveChannel"
      @settings="leaveChannel"
    >
    </chat-header>
    <div class="message-list">
      <div class="message-container" ref="MessageContainer">
        <div
          v-for="message in messages"
          :key="message.state.sid"
          class="message-list__item"
          :class="{ 'message-sender': isSender(message) }"
        >
          {{ message.state.body }}
        </div>
      </div>
    </div>
    <div class="message-toolbar">
      <div
        class="message-toolbar__message"
        contenteditable="true"
        spellcheck="true"
        ref="Message"
        @keydown="listenTyping"
      ></div>
    </div>
  </div>
</template>

<script>
import ChatHeader from "./header";

export default {
  props: {
    channel: {
      type: Object,
      required: true
    },
    userContext: {
      type: Object,
      required: true
    }
  },
  components: {
    ChatHeader
  },
  data() {
    return {
      description: "",
      messages: [],
      typing: [],
      members:[],
      formData: {
        message: ""
      }
    };
  },
  watch: {
    "channel.friendlyName": {
      handler() {
        this.getMessages();
      },
      immediate: true
    }
  },
  computed: {
    descriptionText() {
      return this.typing.length ? "Typing..." : this.description;
    },
    channelName() {
      return this.userContext.identity == this.channel.attributes.receiver
        ? this.channel.createdBy
        : this.channel.friendlyName;
    }
  },
  created() {
    this.getDescription();
  },
  mounted() {
    setTimeout(() => {
      this.scrollToBottom();
    });
  },
  beforeUnmount() {
    this.removeActiveChannelListeners();
  },
  methods: {
    isSender(message) {
      return this.userContext.identity == message.author;
    },
    getChannelName() {
      this.channel.getMembers().then(members => {
        this.members = members;
      });
    },
    async getDescription() {
      return await this.channel.getAttributes().then(attributes => {
        this.description = attributes.description;
      });
    },
    leaveChannel() {
      this.$emit("left", this.channel);
    },
    sendMessage() {
      this.channel.sendMessage(this.$refs.Message.textContent);
      setTimeout(() => {
        this.$refs.Message.innerHTML = "";
      });
    },
    listenTyping(e) {
      if (e.keyCode === 13) {
        this.sendMessage();
      } else {
        this.channel.typing();
      }
    },

    scrollToBottom(behavior) {
      const el = this.$refs.MessageContainer;
      console.log(el.scrollHeight);
      if (el) {
        console.log(el.scrollHeight);
        setTimeout(() => {
          el.scrollTo({ top: el.scrollHeight, behavior });
        });
      }
    },

    removeActiveChannelListeners() {
      this.channel.removeListener("messageAdded", this.addMessage);
      this.channel.removeListener("messageRemoved", this.removeMessage);
      this.channel.removeListener("messageUpdated", this.updateMessage);
      this.channel.removeListener("memberUpdated", this.updateMember);
    },

    getMessages() {
      this.channel.getMessages(30).then(page => {
        this.activeChannelPage = page;
        this.messages = page.items;
        this.scrollToBottom();
        this.channel.on("messageAdded", this.addMessage);
        this.channel.on("messageUpdated", this.updateMessage);
        this.channel.on("messageRemoved", this.removeMessage);
      });

      this.channel.on("typingStarted", member => {
        console.log("escribiendo");
        member.getUser().then(user => {
          this.typing.push(user.friendlyName || member.identity);
        });
      });

      this.channel.on("typingEnded", member => {
        member.getUser().then(user => {
          this.typing = this.typing.filter(
            userName => !userName.includes(user.friendlyName || member.identity)
          );
        });
      });
    },
    // chat functions
    removeMessage() {
      console.log("removed");
    },

    addMessage(message) {
      this.messages.push(message);
      this.scrollToBottom("smooth");
    },

    updateMessage() {
      console.log("removed");
    },

    updateMember() {
      console.log("removed");
    }
  }
};
</script>

<style lang="scss">
.message-list {
  position: relative;
  flex: 1 1 0;
  order: 2;

  &__item {
    @apply bg-gray-800 text-white m-5 my-2 p-5 py-3 rounded text-left;
    width: fit-content;
    &.message-sender {
      @apply bg-blue-700;
      right: 0;
      margin-left: auto;
    }
  }

  .message-container {
    position: absolute;
    top: 0;
    z-index: 100;
    display: block;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}

.message-toolbar {
  @apply w-full bg-gray-200;
  position: relative;
  z-index: 1;
  flex: none;
  order: 3;
  min-height: 62px;

  &__message {
    @apply text-left px-5 py-3 h-full;
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
}
</style>
