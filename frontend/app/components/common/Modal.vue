<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  title: '',
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
}

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick(event: Event) {
  if (event.target === event.currentTarget) {
    close()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

// Lock body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click="onOverlayClick"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50" aria-hidden="true" />

        <!-- Modal Card -->
        <Transition
          enter-active-class="transition ease-out duration-200 transform"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150 transform"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            class="relative bg-white rounded-xl shadow-xl w-full overflow-hidden"
            :class="sizeClasses[size]"
          >
            <!-- Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <slot name="header">
                <h3 class="text-lg font-semibold text-[#1E2B47]">{{ title }}</h3>
              </slot>
              <button
                type="button"
                class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close modal"
                @click="close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-gray-200 bg-gray-50"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
