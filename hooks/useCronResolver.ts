import { createClient } from "@/lib/supabase/client";
import { scheduleAction } from "@/lib/actions/scheduleAction";

// Helper function to calculate missed runs based on interval
const calculateMissedRuns = (lastActivation: string, interval: number): number => {
    const now = new Date().getTime();
    const lastActivationTime = new Date(lastActivation).getTime();
    const timeDifference = now - lastActivationTime;

    // Calculate how many times the function should have run
    return Math.floor(timeDifference / interval);
};

export const useCronResolver = async () => {
    const functions: { [key: string]: () => Promise<void> } = {
        'resolve_schedules': async () => scheduleAction.executeSchedules(),
    };

    const supabase = createClient();

    // Fetching scheduled functions from Supabase
    const { data: scheduleFunctions, error } = await supabase
        .from('cron_functions')
        .select('*')
        .gte('next_activation_at', new Date().toISOString());

    if (error) {
        console.error('Error getting functions:', error.message);
        return;
    }

    if (scheduleFunctions?.length) {
        // Looping through the schedule functions
        for (const scheduleFunction of scheduleFunctions) {
            const executeFunction = functions[scheduleFunction.function_key];
            
            if (executeFunction) {
                try {
                    const missedRuns = calculateMissedRuns(scheduleFunction.next_activation_at, scheduleFunction.interval);
                    
                    // Execute the function missedRuns times
                    for (let i = 0; i < missedRuns; i++) {
                        await executeFunction(); // Await each execution
                    }

                    // Update next_activation_at to the next multiple of the interval
                    const newNextActivation = new Date(
                        new Date(scheduleFunction.next_activation_at).getTime() + missedRuns * scheduleFunction.interval
                    ).toISOString();

                    const { error: updateError } = await supabase
                        .from('cron_functions')
                        .update({ next_activation_at: newNextActivation })
                        .eq('function_key', scheduleFunction.function_key);

                    if (updateError) {
                        console.error('Error updating next activation time:', updateError.message);
                    }

                } catch (err) {
                    console.error('Error running function:', (err as Error).message);
                }
            } else {
                console.error(`No function found for name: ${scheduleFunction.function_key}`);
            }
        }
    }
};
