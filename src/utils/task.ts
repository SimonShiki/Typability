export function executeLongTask<T> (task: Promise<T>, setLoading: (value: boolean) => void, timeout: number) : Promise<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let loading = false;
    const loadingAnimationPromise = new Promise<void>(() => {
        timer = setTimeout(() => {
            loading = true;
        }, timeout);
    });
    return new Promise((resolve) => {
        Promise.race([task, loadingAnimationPromise]).then((result) => {
            if (timer) clearTimeout(timer);
            if (loading) setLoading(false);
            // There's no chance for loadingAnimationPromise to resolve anything.
            resolve(result as Promise<T>);
        });
    });
}