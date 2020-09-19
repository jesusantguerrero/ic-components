<template>
  <div>
    <chat-Login
      v-if="!isLoggedIn"
      :endpoint="endpoint"
      @logged="createClient"
    ></chat-Login>

    <div class="home-container flex" v-else>
      <div
        class="chat-side__container h-screen border-r-2 border-gray-700 w-1/3"
        v-if="!activeChannel || display == 'full'"
      >
        <chat-side
          :user-context="userContext"
          :channels="channels"
          :active-channel="activeChannel"
          @join-channel="joinChannel"
          @create-or-join="createOrJoin"
        >
        </chat-side>
      </div>

      <div v-if="activeChannel || display == 'full'" class="w-2/3">
        <chat-messager
          :active-channel="activeChannel"
          :user-context="userContext"
          v-if="activeChannel"
          @left="leaveChannel"
          @read="$emit('read', $event)"
        >
        </chat-messager>
      </div>
    </div>
  </div>
</template>

<script>
import * as Twilio from "twilio-chat";
import ChatLogin from "./login";
import ChatMessager from "./messager";
import ChatSide from "./side";

export default {
  components: {
    ChatLogin,
    ChatMessager,
    ChatSide
  },
  props: {
    display: {
      type: String,
      default: "mobile"
    }
  },
  data() {
    return {
      client: null,
      channels: [],
      messages: [],
      contacts: [
        {
          email: "freesgen@mctekk.com",
          name: "Freesgen"
        },
        {
          email: "jesusant@mctekk.com",
          name: "Jesus McTekk"
        },
        {
          email: "jesusant.guerrero@gmail.com",
          name: "Jesus Guerrero"
        },
        {
          email: "max@mctekk.com",
          name: "Max Castro"
        }
      ],
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
      this.updateChannels();
      this.loadChannelEvents(client);
    },

    async createOrJoin(contact) {
      const channel = this.channels.find(channel => {
        return channel.uniqueName && channel.uniqueName.includes(contact.email);
      });
      if (channel) {
        this.setActiveChannel(channel);
      } else {
        this.client
          .createChannel({
            attributes: {
              receiver: contact.email,
              receiverName: contact.name
            },
            friendlyName: contact.name,
            isPrivate: true,
            uniqueName: `${this.userContext.identity}-${contact.email}`
          })
          .then(async channel => {
            await channel.invite(contact.email);
            return channel.join();
          })
          .then(this.setActiveChannel);
      }
    },

    joinChannel(channel) {
      if (channel.status == "joined") {
        this.setActiveChannel(channel);
      } else {
        channel.join().then(this.setActiveChannel);
      }
    },

    onTokenAboutToExpire() {
      console.log("about to expire");
    },

    async updateChannels(channel) {
      if (channel && !channel.status == "joined") {
        channel.join();
      }

      const subscribed = await this.client
        .getSubscribedChannels()
        .then(page => {
          return page.items.map(item => item);
        });
      this.channels = subscribed;
      console.log("update channels");
    },

    leaveChannel() {
      this.activeChannel = null;
      this.updateChannels();
    },

    loadChannelEvents(client) {
      client.on("channelJoined", channel => {
        channel.on("messageAdded", () => {
          this.updateChannels();
        });
        this.updateChannels();
      });

      client.on("channelInvited", this.updateChannels);
      client.on("channelAdded", this.updateChannels);
      client.on("channelUpdated", this.updateChannels);
      client.on("channelLeft", this.leaveChannel);
      client.on("channelRemoved", this.leaveChannel);
    },

    setActiveChannel(channel) {
      this.activeChannel = channel;
    }
  }
};
</script>
