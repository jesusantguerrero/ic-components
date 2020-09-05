<template>
  <div class="login h-screen">
    <chat-header
      :show-back-button="true"
      :show-settings="true"
      :title="channel.friendlyName"
      @back="leaveChannel"
      @settings="leaveChannel"
    >
    </chat-header>
    <div>
      <div v-for="message in messages" :key="message.state.sid">
        {{ message.state.body }}
      </div>
    </div>
    <input
      type="text"
      v-model="formData.message"
      @keydown.enter="sendMessage"
    />
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
    getMessages() {
      this.channel.getMessages(30).then(page => {
        this.activeChannelPage = page;
        this.messages = page.items;
        this.channel.on("messageAdded", this.addMessage);
        this.channel.on("messageUpdated", this.updateMessage);
        this.channel.on("messageRemoved", this.removeMessage);
      });

      //   channel.on("typingStarted", function(member) {
      //     member.getUser().then(user => {
      //       this.typingMembers.add(user.friendlyName || member.identity);
      //       this.updateTypingIndicator();
      //     });
      //   });

      //   channel.on("typingEnded", function(member) {
      // member.getUser().then(user => {
      //   this.typingMembers.delete(user.friendlyName || member.identity);
      //   this.updateTypingIndicator();
      // });
      //   });
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
