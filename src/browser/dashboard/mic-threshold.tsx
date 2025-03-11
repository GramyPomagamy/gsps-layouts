import { DashboardThemeProvider } from "./components/DashboardThemeProvider";
import { render } from '../render'
import { useReplicant } from "use-nodecg";
import { useEffect, useState } from "react";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";

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

    return <DashboardThemeProvider>
        <Box>
            {Object.entries(localThresholdLevels).map(([key, value]) => {
                if (key.length !== 0) {
                    return (
                        <Stack direction='row' key={key} spacing={2}>
                            <Typography variant="body1">{key}</Typography>
                            <Slider
                                value={value}
                                onChange={handleSliderChange(key)}
                                min={-90}
                                max={0}
                                step={0.1}
                                aria-labelledby={key}
                            />
                            <Typography variant="body1">{value}dB</Typography>
                        </Stack>
                    )
                } else {
                    return <></>
                }
            })}
            <Button
                disabled={mixerThresholdLevels === localThresholdLevels}
                variant="contained"
                fullWidth
                onClick={() => {
                    setMixerThresholdLevels(localThresholdLevels)
                }}>
                Zapisz zmiany
            </Button>
        </Box>
    </DashboardThemeProvider>
}

render(<MicThreshold />)