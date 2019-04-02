<!--<template>
  <div class="vcomment"
       v-if="data.comments === true">
    <div id="vcomments"></div>
  </div>
</template>

<script>
import { isActive, hashRE, groupHeaders } from '../util'
export default {
  computed: {
    data() {
      return this.$page.frontmatter
    },
  },
  mounted: function () {
    this.createValine()
  },

  methods: {
    createValine() {
      const Valine = require('valine');
      window.AV = require('leancloud-storage')
      const valine = new Valine({
        el: '#vcomments',
        appId: 'qCXPV2y7LGjegj05Q7Teavl3-gzGzoHsz',
        appKey: 'VFGMH7rHBbBl2lkLedKnhNfi',
        notify: false,
        verify: false,
        avatar: 'monsterid',
        path: window.location.pathname,
        placeholder: '等评论等很久了...',
      });
      this.valineRefresh = false
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path !== from.path) {
        setTimeout(() => {
          // 重新刷新 valine
          this.createValine()
        }, 180)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#vcomments {
  max-width: 740px;
  padding: 10px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>-->
<template>
  <section id="vcomments">
    <div>
      <!-- id 将作为查询条件 -->
      <span class="leancloud-visitors"
            data-flag-title="Your Article Title">
        <em class="post-meta-item-text">阅读量： </em>
        <i class="leancloud-visitors-count"></i>
      </span>
    </div>
    <h3>
      <a href="javascript:;"></a>
      评 论：
    </h3>
    <div id="vcomments"></div>
  </section>
</template>

<script>
export default {
  name: 'Valine',
  mounted: function () {
    // require window
    const Valine = require('valine');
    if (typeof window !== 'undefined') {
      document.getElementsByClassName('leancloud-visitors')[0].id
        = window.location.pathname
      this.window = window
      window.AV = require('leancloud-storage')
    }

    new Valine({
      el: '#vcomments',
      appId: 'qCXPV2y7LGjegj05Q7Teavl3-gzGzoHsz',
      appKey: 'VFGMH7rHBbBl2lkLedKnhNfi',
      notify: false,
      verify: false,
      path: window.location.pathname,
      visitor: true,
      avatar: 'monsterid',
      placeholder: '等评论等很久了...'
    });
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
#vcomments {
  max-width 740px
  padding 10px
  display block;
  margin-left auto;
  margin-right auto;
}
</style>
