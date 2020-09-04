<template>
  <div>
    <chat-Login
      v-if="!isLoggedIn"
      :endpoint="endpoint"
      @logged="createClient"
    ></chat-Login>

    <div class="home-container" v-else>
      <div class="channels bg-gray-200 h-screen">
        <div>
          <div
            v-for="channel in channels"
            :key="channel.id"
            class=" border-2 border-gray-400 px-2 py-5"
          >
            {{ channel.friendlyName }}
          </div>
        </div>
      </div>
      <div class="contacts"></div>
      <div class="chat"></div>
    </div>
  </div>
</template>

<script>
import * as Twilio from "twilio-chat";
import ChatLogin from "./login";

export default {
  components: {
    ChatLogin
  },
  data() {
    return {
      client: null,
      channels: [],
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
      this.loadChannelEvents();
    },

    onTokenAboutToExpire() {
      console.log("about to expire");
    },

    updateChannels() {
      this.client.getSubscribedChannels().then(page => {
        this.channels = page.items;
      });
      console.log("update channels");
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
    }
  }
};
</script>

<style></style>
