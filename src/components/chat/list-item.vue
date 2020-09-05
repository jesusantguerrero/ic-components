<template>
  <div
    class="border-b-2 border-gray-400 mx-5 pl-10 px-2 py-5 text-left cursor-pointer hover:bg-gray-400"
    @click.prevent="$emit('click')"
  >
    <div class="font-bold">
      {{ getChannelName(channel) }}
    </div>
    <div>
      {{ lastMessage.body }}
    </div>
    <div class="text-xs text-blue-400 font-bold"> {{ descriptionText }}</div>
  </div>
</template>

<script>
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
  data() {
    return {
      lastMessage: {},
      typing: []
    };
  },
  created() {
    this.listenChannel();
  },
  computed: {
    descriptionText() {
      return this.typing.length ? "Typing..." : "";
    }
  },
  methods: {
    getChannelName(channel) {
      let memberName = channel.friendlyName;
      if (channel.members.size == 1) {
        channel.members.forEach(member => {
          if (
            this.userContext &&
            this.userContext.identity != member.state.identity
          ) {
            memberName = member.state.identity;
          }
        });
      }
      return memberName;
    },

    listenChannel() {
      this.getLastMessage();
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
