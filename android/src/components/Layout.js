
import React, {useState} from 'react'
import { View, Text, FlatList } from 'react-native'

const Layout = () => {
    const [data, setData] = useState()

    const renderItem = ({item}) => {
        <View>
            <Text>
                {item.text}
            </Text>
        </View>
    }
    return (
        <View>
            <Text></Text>
            <FlatList
                data={data}
                renderItem={renderItem}
            />
        </View>
    )
}

export default Layout
