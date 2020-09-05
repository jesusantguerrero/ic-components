<template>
  <div
    class="border-b-2 border-gray-400 mx-5 pl-10 px-2 py-5 text-left cursor-pointer hover:bg-gray-400"
    @click.prevent="$emit('click')"
  >
    <div class="font-bold">
      {{ channelName }}
    </div>
    <div class="flex justify-between">
      <div class="w-full">
        {{ lastMessage.body }}
      </div>
      <div
        v-if="channel.newMessages"
        class="indicator w-4 px-3 rounded-full bg-red-500 text-white font-bold flex justify-center items-center"
      >
        {{ channel.newMessages }}
      </div>
    </div>
    <div class="text-xs text-blue-400 font-bold">{{ descriptionText }}</div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true
    },
    activeChannel: {
      type: Object,
      required: true
    },
    userContext: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      lastMessage: {},
      typing: [],
      members: [],
      newMessages: 0
    };
  },
  created() {
    this.listenChannel();
  },
  computed: {
    descriptionText() {
      return this.typing.length ? "Typing..." : "";
    },
    channelName() {
      return this.userContext.identity == this.channel.attributes.receiver
        ? this.channel.createdBy
        : this.channel.friendlyName;
    }
  },
  methods: {
    getChannelName() {
      this.channel.getMembers().then(members => {
        this.members = members;
      });
    },

    listenChannel() {
      this.getLastMessage();
      this.getChannelName();
      this.channel.on("messageAdded", this.getLastMessage);
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

    getLastMessage() {
      this.channel.getMessages(1).then(messages => {
        this.lastMessage = messages.items.length ? messages.items[0] : {};
      });
    }
  }
};
</script>

<style></style>
