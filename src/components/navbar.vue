<template>
    <nav :class="'navbar navbar-expand-lg ' + classes">
        <router-link :to="'/'" class="navbar-brand">
            {{title}}
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <slot name="beforepages"></slot>
            <li class="nav-item" v-for="page in pages" :key="page">
            <router-link :to="page" class="nav-link">
                {{page}}
            </router-link>
            </li>
            <slot name="afterpages"></slot>
        </ul>
        </div>
    </nav>
</template>
<script>
export default {
  name: 'navbar',
  props: {
    'title': {
      'type': String,
      'required': false,
      'default': 'dataVue'
    },
    'classes': {
      'type': String,
      'required': false,
      'default': 'navbar-light bg-light'
    }
  }
}
</script>
