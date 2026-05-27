import { DashboardThemeProvider } from "./components/DashboardThemeProvider";
import { render } from '../render'
import { useReplicant } from "use-nodecg";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Input, Slider, Typography } from "@mui/material";

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

let debounceTimeout: ReturnType<typeof setTimeout>;

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

    useEffect(() => {
        if (!mixerThresholdLevels) return;

        setLocalThresholdLevels(mixerThresholdLevels);
    }, [mixerThresholdLevels])

    const handleSliderChange = (key: string) => (_event: Event, newVal: number | number[]) => {
        setLocalThresholdLevels((prevLevels) => ({
            ...prevLevels,
            [key]: newVal as number
        }))
    }

    useEffect(() => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            setMixerThresholdLevels(localThresholdLevels);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [localThresholdLevels]);
    

    return <DashboardThemeProvider>
        <Box 
        display="grid"
        gridTemplateColumns="70px 1fr 90px"
        gap={2}
        alignItems="center"
        sx={{maxWidth: '100vw', margin: '20px auto'}}
        >
            {Object.entries(localThresholdLevels).map(([key, value]) => {
                if (key.length !== 0) {

                    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
                        const val = e.target.value === '' ? -90 : Number(e.target.value);
                        const clampedVal = Math.min(Math.max(val, -90), 0);

                        handleSliderChange(key)({} as any, clampedVal);
                    }

                    return (
                        <React.Fragment key={key}>
                            <Typography variant="body1" noWrap>{key}</Typography>
                            <Slider
                                value={value}
                                onChange={handleSliderChange(key)}
                                min={-90}
                                max={0}
                                step={0.1}
                                aria-labelledby={key}
                            />
                            <Input
                                value={value}
                                size="small"
                                onChange={handleInputChange}
                                slotProps={{
                                    input: {
                                        step: 0.1,
                                        min: -90,
                                        max: 0,
                                        type: 'number',
                                    },
                                }}
                                endAdornment={<Typography variant="body2" sx={{ml: 0.5}}>dB</Typography>}
                                sx={{ '& input': { textAlign: 'right'}}}
                            />
                        </React.Fragment>
                    )
                } else {
                    return <></>
                }
            })}
            <Box gridColumn="span 3" sx={{ mt: 2}}>
                <Button
                    disabled={mixerThresholdLevels === localThresholdLevels}
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        clearTimeout(debounceTimeout);
                        setMixerThresholdLevels(localThresholdLevels);
                    }}>
                    Zapisz zmiany
                </Button>
            </Box>
        </Box>
    </DashboardThemeProvider>
}

render(<MicThreshold />)