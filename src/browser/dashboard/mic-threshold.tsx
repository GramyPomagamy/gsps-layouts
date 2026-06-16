import { DashboardThemeProvider } from "./components/DashboardThemeProvider";
import { render } from '../render'
import { useReplicant } from "use-nodecg";
import React, {useEffect, useState, useRef } from "react";
import { Box, Slider, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SyncIcon from "@mui/icons-material/Sync";

const channelIdToName = {
    "1": "H1",
    "2": "H2",
    "3": "H3",
    "4": "H4",
    "9": "Host1",
    "10": "Host2",
    "16": "Host3",
    "5": "Gra1",
    "7": "Gra2",
    "11": "Donacje",
};

const channelNameToId = Object.entries(channelIdToName).reduce((acc, [id, name]) => {
    acc[name] = id;
    return acc;
}, {} as Record<string, string>);

export const MicThreshold = () => {

    const [mixerThresholdLevels, setMixerThresholdLevels] = useReplicant<{ [key in keyof typeof channelNameToId]: number }>(
        'mixerThresholdLevels',
        Object.keys(channelNameToId).reduce((acc, name) => {
            acc[name] = -30
            return acc;
        }, { "": +Infinity } as Record<string, number>)
    )

    const [localThresholdLevels, setLocalThresholdLevels] = useState<{ [key in keyof typeof channelNameToId]: number }>(
        Object.keys(channelNameToId).reduce((acc, name) => {
            acc[name] = -30
            return acc;
        }, { "": +Infinity } as Record<string, number>)
    )

    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const[isSaving, setIsSaving] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const spinKeyframes = {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    }
 
    const handleSliderChange = (key: string) => (_event: Event, newVal: number | number[]) => {
        setIsSaving(true);
        setLocalThresholdLevels((prevLevels) => ({
            ...prevLevels,
            [key]: newVal as number
        }))
    }

    const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>, key: string, value: number) => {
                e.preventDefault();
                const direction = e.deltaY < 0 ? 1 : -1;
                const step = 0.1;
                const nextVal = Number((value + direction * step).toFixed(1));
                const clampedVal = Math.min(Math.max(nextVal, -90), 0);
                handleSliderChange(key)({} as any, clampedVal);
    }

    useEffect(() =>{
        const container = scrollContainerRef.current;
        
        if(!container) return;

        const preventDefaultScroll = (e: WheelEvent) => {
            if (e.deltaY !== 0){
                e.preventDefault();
            }
        }

        container.addEventListener('wheel', preventDefaultScroll, {passive: false});

        return ()=>{
            container.removeEventListener('wheel', preventDefaultScroll);
        }
    }, [])

    useEffect(() => {
        if (!mixerThresholdLevels) return;

        setLocalThresholdLevels(mixerThresholdLevels);
        setIsSaving(false);
    }, [mixerThresholdLevels])

    useEffect(() => {
        if (debounceTimeout.current){
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            setMixerThresholdLevels(localThresholdLevels);
        }, 500);

        return () => {
            if (debounceTimeout.current){
                clearTimeout(debounceTimeout.current);
            }
        }
    }, [localThresholdLevels]);
    
    return <DashboardThemeProvider>
        <Box 
        ref={scrollContainerRef}
        display="grid"
        gridTemplateColumns="70px 1fr 70px"
        gap={2}
        rowGap={1}
        alignItems="center"
        sx={{maxWidth: '100vw', margin: '5px auto'}}
        >
            {Object.entries(localThresholdLevels).map(([key, value]) => { 
                if (key.length !== 0) {
                    return (
                        <React.Fragment key={key}>
                            <Typography variant="body1" noWrap>{key}</Typography>
                            <Box onWheel={(e) => handleWheelScroll(e, key, value)} sx={{display: 'flex', alignItems:'center'}}>
                                <Slider
                                    value={value}
                                    onChange={handleSliderChange(key)}
                                    min={-90}
                                    max={0}
                                    step={0.1}
                                    aria-labelledby={key}
                                    sx={{padding: '8px 0'}}
                                />
                            </Box>
                            <Box
                            onWheel={(e) => handleWheelScroll(e, key, value)}
                            sx={{
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                alignItems: 'center',
                                paddingRight: '4px',
                                height: '5px',
                                userSelect: 'none'
                            }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: '500', minWidth: '45px', textAlign: 'right' }}>
                                {value.toFixed(1)}
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 0.5, color: 'text.secondary' }}>
                                    dB
                                </Typography>
                            </Box>
                        </React.Fragment>
                    )
                } else {
                    return <></>
                }           
            })}
            <Box 
                gridColumn="span 3" 
                sx={{ 
                    mt: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    gap: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: isSaving ? 'rgba(255, 204, 0, 0.1)' : 'rgba(85, 170, 85, 0.1)',
                    transition: 'all 0.3s ease'
                }}
            >
                {isSaving ? (
                    <>
                        <SyncIcon sx={{ color: 'rgba(255, 204, 0, 1)', animation: 'spin 1s linear infinite', '@keyframes spin' : spinKeyframes }} />
                        <Typography variant="body2" sx={{ color: 'rgba(255, 204, 0, 1)', fontWeight: 'bold' }}>
                            Zapisywanie...
                        </Typography>
                    </>
                ) : (
                    <>
                        <CheckCircleOutlineIcon sx={{ color: 'rgba(85, 170, 85, 1)' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(85, 170, 85, 1)', fontWeight: 'bold' }}>
                            Wszystko zapisano
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    </DashboardThemeProvider> 
}

render(<MicThreshold />)