<template>
  <div id="app">
    <div class="main">
      <div id="nav">
        <router-link to="/downloading"
          >正在下载({{
            -(-globalStat.numWaiting - globalStat.numActive)
          }})</router-link
        >
        <router-link to="/completed"
          >已完成({{ globalStat.numStopped }})</router-link
        >
        <router-link to="/new">新建下载</router-link>
        <router-link to="/settings">设置</router-link>
        <router-link to="/servers">服务器列表</router-link>
      </div>
      <router-view />
    </div>
    <div class="global-stat">
      全局上传速度: {{ globalStat.uploadSpeed }} 全局下载速度:
      {{ globalStat.downloadSpeed }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      globalStat: {},
    };
  },
  async mounted() {
    this.globalStat = await window.aria2.getGlobalStat();
    this.intervalId = setInterval(async () => {
      this.globalStat = await window.aria2.getGlobalStat();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
};
</script>

<style lang="less">
.main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  display: flex;
  h2 {
    margin: 0;
  }
}

#nav {
  width: 120px;
  border-right: 1px solid;
  padding: 10px;
  flex-grow: 0;
  flex-shrink: 0;

  a {
    display: block;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.global-stat {
  text-align: right;
}
</style>
