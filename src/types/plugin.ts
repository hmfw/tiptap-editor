import type { Component } from 'vue'
import type { Extension, Node, Mark } from '@tiptap/core'
import type { ComputedRef } from 'vue'

export interface PluginInstallContext {
  readonly: ComputedRef<boolean>
  provide: <T>(key: string, value: T) => void
}

export interface PluginInstallResult {
  extensions: (Extension | Node | Mark)[]
  controlComponent?: Component
}

export interface FeaturePlugin {
  name: string
  install: (ctx: PluginInstallContext) => PluginInstallResult
  toolbarComponent?: Component
}
