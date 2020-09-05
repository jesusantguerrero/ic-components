<template>
  <div class="login h-screen">
    <chat-header
      :show-back-button="true"
      :show-settings="true"
      :title="channel.friendlyName"
      :description="descriptionText"
      @back="leaveChannel"
      @settings="leaveChannel"
    >
    </chat-header>
    <div>
      <div v-for="message in messages" :key="message.state.sid">
        {{ message.state.body }}
      </div>
    </div>
    <input type="text" v-model="formData.message" @keydown="listenTyping" />
  </div>
</template>

<script>
import ChatHeader from "./header";

export default {
  props: {
    channel: {
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
    }
  },
  created() {
    this.getDescription();
  },
  methods: {
    async getDescription() {
      return await this.channel.getAttributes().then(attributes => {
        this.description = attributes.description;
      });
    },
    leaveChannel() {
      this.$emit("left", this.channel);
    },
    sendMessage() {
      this.channel.sendMessage(this.formData.message);
      this.formData.message = "";
    },
    listenTyping(e) {
      if (e.keyCode === 13) {
        this.sendMessage();
      } else {
        this.channel.typing();
      }
    },

    getMessages() {
      this.channel.getMessages(30).then(page => {
        this.activeChannelPage = page;
        this.messages = page.items;
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
    },

    updateMessage() {
      console.log("removed");
    }
  }
};
</script>

<style></style>
