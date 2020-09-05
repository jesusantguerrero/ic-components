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
          <chat-header
            :show-back-button="true"
            :show-settings="!addNewChat"
            :left-icon="!addNewChat ? 'fa fa-menu' : 'fa fa-chevron-left'"
            right-icon="fa fa-plus"
            :title="headerTitle"
            @back="addNewChat = !addNewChat"
            @settings="addNewChat = !addNewChat"
          >
          </chat-header>
          <template v-if="!addNewChat">
            <chat-item
              v-for="channel in channels"
              :key="channel.id"
              :channel="channel"
              :user-context="userContext"
              :active-channel="activeChannel"
              @click="joinChannel(channel)"
            >
            </chat-item>
          </template>
          <template v-else>
            <div
              v-for="contact in contacts"
              :key="contact.email"
              @click="createOrJoin(contact)"
              class="border-b-2 border-gray-400 mx-5 pl-10 px-2 py-5 text-left cursor-pointer hover:bg-gray-400"
            >
              {{ contact.email }}
            </div>
          </template>
        </div>
      </div>
      <chat-messager
        :channel="activeChannel"
        :user-context="userContext"
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
import ChatHeader from "./header";
import ChatItem from "./list-item";

export default {
  components: {
    ChatLogin,
    ChatMessager,
    ChatHeader,
    ChatItem
  },
  data() {
    return {
      client: null,
      addNewChat: false,
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
    },
    headerTitle() {
      return this.addNewChat ? "Contacts" : "Dealer One";
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
      // subscribed.forEach(channel => channel.delete());
      this.channels = subscribed;
      console.log("update channels");
    },

    leaveChannel(channel) {
      channel.removeListener("messageAdded", this.updateUnreadMessages);
      this.activeChannel = null;
      this.updateChannels();
    },

    updateUnreadMessages(message) {
      if (message && this.activeChannel != message.channel) {
        const index = this.channels.findIndex(
          channel => channel.sid == message.channel.sid
        );
        const count = this.channels[index].newMessages || 0;
        this.$set(this.channels[index], "newMessages", count + 1);
      }
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
      this.messages.push(message);
    },

    updateMessage() {
      console.log("removed");
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
      this.activeChannel = channel;
    }
  }
};
</script>

<style></style>
