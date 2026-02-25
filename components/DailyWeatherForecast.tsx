import { View, Text, FlatList } from 'react-native'
import React from 'react'

const DailyWeatherForecast = ({forecast}:any) => {
    if(!forecast) return null;
    return (
        <View className='flex gap-2'>
            <Text className='text-bold text-2xl '>Daily Forecast (24h)</Text>
            <View>
                <FlatList
                    data= {forecast?.list.slice(0,8) || []}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index)=> index.toString()}
                    renderItem={({item})=>(
                        <View className='items-center bg-slate-800 rounded-xl px-4 py-3 mr-4'>
                            <Text className='text-white'>
                                {new Date(item.dt *1000).toLocaleTimeString([],{hour:'numeric'})}
                            </Text>
                            <Text className="text-white text-lg font-bold mt-2">
                                {Math.floor(item.main.temp)}°
                            </Text>
                            <Text  className="text-slate-300 mt-1">
                                {item.weather[0].main}
                            </Text>
                        </View>
                    )}
                
                />
            </View>
        </View>
    )
}

export default DailyWeatherForecast