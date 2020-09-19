<template>
  <div class="chat-container h-screen">
    <chat-header
      :show-back-button="true"
      :show-settings="false"
      :title="channelName"
      :description="descriptionText"
      @back="leaveChannel"
      @settings="leaveChannel"
    >
    </chat-header>
    <div class="message-list">
      <div
        class="message-container"
        ref="MessageContainer"
        :class="{ 'quiet-loading': isLoading }"
      >
        <div
          v-for="message in messages"
          :key="message.state.sid"
          class="message-list__item"
          :class="{ 'message-sender': isSender(message) }"
        >
          <span
            v-if="channel.type == 'public'"
            class="sender-name block mb-1 text-orange-500"
            :class="{ me: isSender(message) }"
          >
            {{ message.author }}:</span
          >
          <div>
            <div v-html="message.state.body" class="message-body"></div>
            <small class="text-right w-full block text-gray-400 mt-2">
              {{ message.state.timestamp.toISOString().slice(11, 16) }}
              <div v-if="isSender(message)" class="inline">
                <i class="fa fa-check"></i>
                <i class="fa fa-check" v-if="isRead(message)"> </i>
              </div>
            </small>
          </div>
        </div>
      </div>
    </div>
    <div class="message-toolbar flex">
      <div
        class="message-toolbar__message w-full"
        contenteditable="true"
        spellcheck="true"
        ref="Message"
        placeholder="Type..."
        @keydown="listenTyping"
      ></div>
      <button class="btn bg-blue-700 text-white h-12 self-end">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import ChatHeader from "./header";
import mitt from "mitt";
const emitter = mitt();

export default {
  props: {
    activeChannel: {
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
      channel: null,
      isLoading: false,
      messages: [],
      typing: [],
      members: [],
      formData: {
        message: ""
      }
    };
  },
  watch: {
    activeChannel: {
      handler() {
        this.removeActiveChannelListeners();
        this.isLoading = true;
        this.channel = this.activeChannel;
        this.getMessages();
        emitter.emit("read", this.channel.sid);
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
    },
    receiver() {
      return (
        this.members &&
        this.members.find(
          member => member.identity != this.userContext.identity
        )
      );
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

    isRead(message) {
      return (
        this.receiver && message.index <= this.receiver.lastConsumedMessageIndex
      );
    },

    updateMembers() {
      this.channel.getMembers().then(members => {
        this.members = members;
      });
    },

    async getDescription() {
      this.updateMembers();
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
        if (!e.ctrlKey && !e.shiftKey) {
          this.sendMessage();
        }
      } else {
        this.channel.typing();
      }
    },

    scrollToBottom(behavior) {
      const el = this.$refs.MessageContainer;
      if (el) {
        setTimeout(() => {
          el.scrollTo({ top: el.scrollHeight, behavior });
        });
      }
    },

    removeActiveChannelListeners() {
      if (this.channel) {
        this.channel.removeListener("messageAdded", this.addMessage);
        this.channel.removeListener("messageRemoved", this.removeMessage);
        this.channel.removeListener("messageUpdated", this.updateMessage);
        this.channel.removeListener("memberUpdated", this.updateMembers);
      }
    },

    getMessages() {
      this.channel.getMessages(30).then(page => {
        this.messages = page.items;
        this.scrollToBottom();
        const lastIndex = this.messages.length - 1;
        this.setLastConsumedIndex(this.messages[lastIndex].index);
        this.channel.on("messageAdded", this.addMessage);
        this.channel.on("messageUpdated", this.updateMessage);
        this.channel.on("messageRemoved", this.removeMessage);
        this.channel.on("memberUpdated", this.updateMembers);
        setTimeout(() => {
          this.isLoading = false;
        }, 200);
      });

      this.channel.on("typingStarted", member => {
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

    removeMessage() {
      console.log("removed");
    },

    addMessage(message) {
      this.messages.push(message);
      this.setLastConsumedIndex(message.index);
      this.scrollToBottom("smooth");
    },

    updateMessage() {
      console.log("removed");
    },

    setLastConsumedIndex(index) {
      setTimeout(async () => {
        this.channel.updateLastConsumedMessageIndex(index);
      });
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

    .me {
      @apply text-red-200;
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
    white-space: pre-wrap;
  }
}

.message-body {
  white-space: pre-wrap;
}

.chat-container {
  display: flex;
  flex-direction: column;
}

.quiet-loading {
  opacity: 0;
}
</style>
