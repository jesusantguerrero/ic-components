<template>
  <div>
    <chat-Login
      v-if="!isLoggedIn"
      :endpoint="endpoint"
      @logged="createClient"
    ></chat-Login>

    <div class="home-container" v-else>
      <div class="channels bg-gray-200 h-screen" v-if="!activeChannel">
        <div>
          <div
            v-for="channel in channels"
            :key="channel.id"
            class=" border-2 border-gray-400 px-2 py-5"
            @click.prevent="joinChannel(channel)"
          >
            {{ channel.friendlyName }}
          </div>
        </div>
      </div>
      <chat-messager
        :channel="activeChannel"
        v-if="activeChannel"
        @left="leaveChannel"
      >
      </chat-messager>
    </div>
  </div>
</template>

<script>
import * as Twilio from "twilio-chat";
import ChatLogin from "./login";
import ChatMessager from "./messager";

export default {
  components: {
    ChatLogin,
    ChatMessager
  },
  data() {
    return {
      client: null,
      channels: [],
      messages: [],
      activeChannel: null,
      endpoint: "http://localhost:8080",
      userContext: { identity: null }
    };
  },
  computed: {
    isLoggedIn() {
      return this.userContext.identity;
    }
  },
  methods: {
    async createClient(token, identity) {
      const client = await Twilio.Client.create(token, { logLevel: "info" });
      this.userContext.identity = identity;
      this.client = client;

      client.on("tokenAboutToExpire", this.onTokenAboutToExpire);
      client.on("updated", () => {
        console.log("updated");
      });
      client.getSubscribedChannels().then(this.updateChannels);
      this.loadChannelEvents(client);
    },

    onTokenAboutToExpire() {
      console.log("about to expire");
    },

    async updateChannels() {
      const subscribed = await this.client
        .getSubscribedChannels()
        .then(page => {
          return page.items;
        });

      this.channels = await this.client
        .getPublicChannelDescriptors()
        .then(page => {
          return page.items;
        });
      console.log("update channels");
    },

    leaveChannel(channel) {
      channel.removeListener("messageAdded", this.updateUnreadMessages);
      this.activeChannel = null;
      this.updateChannels();
    },

    updateUnreadMessages() {
      console.log("update messages");
    },

    loadChannelEvents(client) {
      client.on("channelJoined", channel => {
        channel.on("messageAdded", () => {
          this.updateChannels();
          this.updateUnreadMessages();
        });
        this.updateChannels();
      });

      client.on("channelInvited", this.updateChannels);
      client.on("channelAdded", this.updateChannels);
      client.on("channelUpdated", this.updateChannels);
      client.on("channelLeft", this.leaveChannel);
      client.on("channelRemoved", this.leaveChannel);
    },

    // chat functions
    removeMessage() {
      console.log("removed");
    },

    addMessage(message) {
      this.messages.push(message)
    },

    updateMessage() {
      console.log("removed");
    },

    joinChannel(channel) {
      channel.getChannel().then(channel => {
        channel
          .join()
          .then(channel => {
            this.setActiveChannel(channel);
          })
          .catch(err => {
            this.setActiveChannel(channel);
          });
      });
    },

    removeActiveChannelListeners() {
      if (this.activeChannel) {
        this.activeChannel.removeListener("messageAdded", this.addMessage);
        this.activeChannel.removeListener("messageRemoved", this.removeMessage);
        this.activeChannel.removeListener("messageUpdated", this.updateMessage);
        this.activeChannel.removeListener("memberUpdated", this.updateMember);
      }
    },

    updateMembers() {
      console.log("updated");
    },

    updateMember() {
      console.log("updated");
    },

    sendMessage(message) {
      this.activeChannel.sendMessage(message);
    },

    setActiveChannel(channel) {
      this.removeActiveChannelListeners();
      this.activeChannel = channel;

      channel.getMessages(30).then(page => {
        this.activeChannelPage = page;
        this.messages = page.items;

        channel.on("messageAdded", this.addMessage);
        channel.on("messageUpdated", this.updateMessage);
        channel.on("messageRemoved", this.removeMessage);
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
    }
  }
};
</script>

<style></style>
