import { View, Text, ScrollView } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const DailyWeatherForecast = ({ forecast }: any) => {
    if (!forecast || !forecast.forecast || !forecast.forecast.forecastday) return null;
    
    const currentDayForecast = forecast.forecast.forecastday[0];
    const dailyForecasts = forecast.forecast.forecastday;

    return (
        <View className='flex gap-2'>
            <Text className='text-bold text-2xl '>Hourly Forecast (Today)</Text>
            <View>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                >
                    {currentDayForecast.hour?.slice(0, 12).map((item: any, index: number) => (
                        <View key={index} className='items-center bg-slate-800 rounded-xl px-4 py-3 mr-4'>
                            <Text className='text-white text-xs'>
                                {item.time?.split(' ')[1]}
                            </Text>
                            <Image 
                                source={{ uri: `https:${item.condition.icon}` }} 
                                style={{ width: 40, height: 40 }} 
                                className="my-1"
                            />
                            <Text className="text-white text-lg font-bold">
                                {Math.floor(item.temp_c)}°
                            </Text>
                            <Text  className="text-slate-300 text-xs">
                                {item.condition.text}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View className='my-6 flex p-2 rounded-lg'>
                <View className='flex-row justify-between mb-2' >
                    <Text className='text-xl font-bold'>
                        Next 3 Days 
                    </Text>
                    <Ionicons name='calendar' size={20} color={"#4b5532"}/>
                </View>
                {dailyForecasts?.map((item: any, index: number) => (
                    <View key={index} className=' flex-row items-center justify-between gap-3 my-3 px-3 bg-white rounded-lg py-3'>
                        <Text className='text-black font-medium'>
                            {new Date(item.date).toDateString().slice(0, 10)}
                        </Text>
                        <View className='flex-row items-center gap-2'>
                            <Image 
                                source={{ uri: `https:${item.day.condition.icon}` }} 
                                style={{ width: 30, height: 30 }} 
                            />
                            <Text className="text-black/70 text-center text-sm" >
                                {item.day.condition.text}
                            </Text>
                        </View>

                        <View className='flex-row items-center gap-2'>
                            <Text className="text-black text-xl font-bold">
                                {Math.floor(item.day.maxtemp_c)}°
                            </Text>
                            <Text className="text-black/60 text-s font-bold">
                                {Math.floor(item.day.mintemp_c)}°
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default DailyWeatherForecast