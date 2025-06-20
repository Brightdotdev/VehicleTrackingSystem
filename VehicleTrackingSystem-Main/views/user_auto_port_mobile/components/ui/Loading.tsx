import { View, Text } from 'react-native'
import React from 'react'
import { TextElement } from '../buildingBlocks/Text'

const Loading = () => {
  return (
    <View className="flex-1 bg-background dark:bg-background">
        
      <TextElement>Auto Port Loading..</TextElement>
    </View>
  )
}

export default Loading